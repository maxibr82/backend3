import { expect } from 'chai';
import sinon from 'sinon';
import usersController from '../../src/controllers/users.controller.js';

describe('Controlador de Usuarios', () => {
    let req, res, usersServiceStub;

    beforeEach(() => {
        // Mock de request y response
        req = {
            params: {},
            body: {}
        };
        res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };
        
        // Mock del servicio (necesitaríamos importarlo y mockearlo)
        usersServiceStub = {
            getAll: sinon.stub(),
            getUserById: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAllUsers', () => {
        it('debería retornar todos los usuarios con estado de éxito', async () => {
            const mockUsers = [
                { _id: '1', email: 'user1@test.com', first_name: 'User', last_name: 'One' },
                { _id: '2', email: 'user2@test.com', first_name: 'User', last_name: 'Two' }
            ];

            // Mock del módulo usersService
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getAll').resolves(mockUsers);

            await usersController.getAllUsers(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith({
                status: "success",
                payload: mockUsers
            })).to.be.true;
        });

        it('should handle errors and return 500 status', async () => {
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getAll').rejects(new Error('Database error'));

            await usersController.getAllUsers(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith({
                status: "error",
                error: "Internal server error"
            })).to.be.true;
        });
    });

    describe('getUser', () => {
        beforeEach(() => {
            req.params.uid = '64a1b2c3d4e5f6789012345';
        });

        it('should return user when found', async () => {
            const mockUser = {
                _id: '64a1b2c3d4e5f6789012345',
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe'
            };

            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getUserById').resolves(mockUser);

            await usersController.getUser(req, res);

            expect(res.send.calledWith({
                status: "success",
                payload: mockUser
            })).to.be.true;
        });

        it('should return 404 when user not found', async () => {
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getUserById').resolves(null);

            await usersController.getUser(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith({
                status: "error",
                error: "User not found"
            })).to.be.true;
        });

        it('should handle database errors', async () => {
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getUserById').rejects(new Error('Database error'));

            await usersController.getUser(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith({
                status: "error",
                error: "Internal server error"
            })).to.be.true;
        });
    });

    describe('updateUser', () => {
        beforeEach(() => {
            req.params.uid = '64a1b2c3d4e5f6789012345';
            req.body = { first_name: 'Updated Name' };
        });

        it('should update user successfully', async () => {
            const mockUser = { _id: '64a1b2c3d4e5f6789012345', email: 'test@example.com' };
            const updateResult = { acknowledged: true };

            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getUserById').resolves(mockUser);
            sinon.stub(usersService, 'update').resolves(updateResult);

            await usersController.updateUser(req, res);

            expect(res.send.calledWith({
                status: "success",
                message: "User updated"
            })).to.be.true;
        });

        it('should return 404 when user to update not found', async () => {
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getUserById').resolves(null);

            await usersController.updateUser(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith({
                status: "error",
                error: "User not found"
            })).to.be.true;
        });

        it('should handle update errors', async () => {
            const mockUser = { _id: '64a1b2c3d4e5f6789012345' };
            
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'getUserById').resolves(mockUser);
            sinon.stub(usersService, 'update').rejects(new Error('Update failed'));

            await usersController.updateUser(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith({
                status: "error",
                error: "Internal server error"
            })).to.be.true;
        });
    });

    describe('deleteUser', () => {
        beforeEach(() => {
            req.params.uid = '64a1b2c3d4e5f6789012345';
        });

        it('should delete user successfully', async () => {
            const deleteResult = { deletedCount: 1 };

            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'delete').resolves(deleteResult);

            await usersController.deleteUser(req, res);

            expect(res.send.calledWith({
                status: "success",
                message: "User deleted"
            })).to.be.true;
        });

        it('should handle delete errors', async () => {
            const { usersService } = await import('../../src/services/index.js');
            sinon.stub(usersService, 'delete').rejects(new Error('Delete failed'));

            await usersController.deleteUser(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith({
                status: "error",
                error: "Internal server error"
            })).to.be.true;
        });
    });
});
