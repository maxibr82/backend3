import { expect } from 'chai';
import sinon from 'sinon';
import GenericRepository from '../../src/repository/GenericRepository.js';

describe('Repositorio Genérico', () => {
    let mockDao;
    let repository;

    beforeEach(() => {
        // Crear un mock del DAO
        mockDao = {
            get: sinon.stub(),
            getBy: sinon.stub(),
            save: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub()
        };
        repository = new GenericRepository(mockDao);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAll', () => {
        it('debería llamar a dao.get con parámetros proporcionados', async () => {
            const params = { status: 'active' };
            const expectedResult = [{ id: 1, name: 'test' }];
            
            mockDao.get.resolves(expectedResult);
            
            const result = await repository.getAll(params);
            
            expect(mockDao.get.calledOnceWith(params)).to.be.true;
            expect(result).to.deep.equal(expectedResult);
        });

        it('debería llamar a dao.get sin parámetros', async () => {
            const expectedResult = [];
            
            mockDao.get.resolves(expectedResult);
            
            const result = await repository.getAll();
            
            expect(mockDao.get.calledOnce).to.be.true;
            expect(result).to.deep.equal(expectedResult);
        });
    });

    describe('getBy', () => {
        it('should call dao.getBy with provided params', async () => {
            const params = { email: 'test@example.com' };
            const expectedResult = { id: 1, email: 'test@example.com' };
            
            mockDao.getBy.resolves(expectedResult);
            
            const result = await repository.getBy(params);
            
            expect(mockDao.getBy.calledOnceWith(params)).to.be.true;
            expect(result).to.deep.equal(expectedResult);
        });

        it('should return null when no document found', async () => {
            const params = { email: 'nonexistent@example.com' };
            
            mockDao.getBy.resolves(null);
            
            const result = await repository.getBy(params);
            
            expect(mockDao.getBy.calledOnceWith(params)).to.be.true;
            expect(result).to.be.null;
        });
    });

    describe('create', () => {
        it('should call dao.save with document', async () => {
            const doc = { name: 'New Document', email: 'new@example.com' };
            const expectedResult = { ...doc, id: 1 };
            
            mockDao.save.resolves(expectedResult);
            
            const result = await repository.create(doc);
            
            expect(mockDao.save.calledOnceWith(doc)).to.be.true;
            expect(result).to.deep.equal(expectedResult);
        });
    });

    describe('update', () => {
        it('should call dao.update with id and document', async () => {
            const id = '123';
            const doc = { name: 'Updated Name' };
            const expectedResult = { id, name: 'Updated Name' };
            
            mockDao.update.resolves(expectedResult);
            
            const result = await repository.update(id, doc);
            
            expect(mockDao.update.calledOnceWith(id, doc)).to.be.true;
            expect(result).to.deep.equal(expectedResult);
        });
    });

    describe('delete', () => {
        it('should call dao.delete with id', async () => {
            const id = '123';
            const expectedResult = { deletedCount: 1 };
            
            mockDao.delete.resolves(expectedResult);
            
            const result = await repository.delete(id);
            
            expect(mockDao.delete.calledOnceWith(id)).to.be.true;
            expect(result).to.deep.equal(expectedResult);
        });
    });

    describe('constructor', () => {
        it('should set dao property correctly', () => {
            expect(repository.dao).to.equal(mockDao);
        });
    });
});
