import { AppError, ValidationError, NotFoundError, UnauthorizedError } from '../../utils/errors';

describe('Error classes', () => {
  it('AppError should have correct properties', () => {
    const err = new AppError('Test error', 500);
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(true);
  });

  it('ValidationError should have 400 status', () => {
    const err = new ValidationError('Invalid', { email: ['Required'] });
    expect(err.statusCode).toBe(400);
    expect(err.errors.email).toContain('Required');
  });

  it('NotFoundError should have 404 status', () => {
    expect(new NotFoundError().statusCode).toBe(404);
  });

  it('UnauthorizedError should have 401 status', () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
  });
});
