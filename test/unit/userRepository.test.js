import { expect } from 'chai';
import sinon from 'sinon';
import UserRepository from '../../src/repository/UserRepository.js';

describe('Repositorio de Usuarios', () => {
    let mockDao;
    let userRepository;

    beforeEach(() => {
        // Crear un mock del DAO
        mockDao = {
            get: sinon.stub(),
            getBy: sinon.stub(),
            save: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub()
        };
        userRepository = new UserRepository(mockDao);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getUserByEmail', () => {
        it('debería llamar a getBy con parámetro de email', async () => {
            const email = 'test@example.com';
            const expectedUser = { 
                _id: '123', 
                email: 'test@example.com', 
                first_name: 'John',
                last_name: 'Doe'
            };
            
            mockDao.getBy.resolves(expectedUser);
            
            const result = await userRepository.getUserByEmail(email);
            
            expect(mockDao.getBy.calledOnceWith({ email })).to.be.true;
            expect(result).to.deep.equal(expectedUser);
        });

        it('should return null when user not found by email', async () => {
            const email = 'nonexistent@example.com';
            
            mockDao.getBy.resolves(null);
            
            const result = await userRepository.getUserByEmail(email);
            
            expect(mockDao.getBy.calledOnceWith({ email })).to.be.true;
            expect(result).to.be.null;
        });
    });

    describe('getUserById', () => {
        it('should call getBy with _id parameter', async () => {
            const id = '64a1b2c3d4e5f6789012345';
            const expectedUser = { 
                _id: id, 
                email: 'test@example.com', 
                first_name: 'Jane',
                last_name: 'Smith'
            };
            
            mockDao.getBy.resolves(expectedUser);
            
            const result = await userRepository.getUserById(id);
            
            expect(mockDao.getBy.calledOnceWith({ _id: id })).to.be.true;
            expect(result).to.deep.equal(expectedUser);
        });

        it('should return null when user not found by id', async () => {
            const id = '64a1b2c3d4e5f6789012345';
            
            mockDao.getBy.resolves(null);
            
            const result = await userRepository.getUserById(id);
            
            expect(mockDao.getBy.calledOnceWith({ _id: id })).to.be.true;
            expect(result).to.be.null;
        });
    });

    describe('inherited methods from GenericRepository', () => {
        it('should have access to getAll method', () => {
            expect(userRepository.getAll).to.be.a('function');
        });

        it('should have access to create method', () => {
            expect(userRepository.create).to.be.a('function');
        });

        it('should have access to update method', () => {
            expect(userRepository.update).to.be.a('function');
        });

        it('should have access to delete method', () => {
            expect(userRepository.delete).to.be.a('function');
        });

        it('should call dao methods through inherited methods', async () => {
            const users = [{ _id: '1', email: 'user1@test.com' }];
            mockDao.get.resolves(users);
            
            const result = await userRepository.getAll();
            
            expect(mockDao.get.calledOnce).to.be.true;
            expect(result).to.deep.equal(users);
        });
    });

    describe('constructor', () => {
        it('should initialize with dao and inherit from GenericRepository', () => {
            expect(userRepository.dao).to.equal(mockDao);
            expect(userRepository.getUserByEmail).to.be.a('function');
            expect(userRepository.getUserById).to.be.a('function');
        });
    });
});
