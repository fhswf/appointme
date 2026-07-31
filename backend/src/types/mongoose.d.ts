import mongoose from 'mongoose';

/**
 * Type declarations to fix mongoose 9.x compatibility issues
 * The models use String for _id which causes union type incompatibilities
 */

// Create a more permissive type for model query methods
type AnyQuery<T = any> = mongoose.Query<T | null, T> & {
  [key: string]: any;
};

// Extend the Model interface with permissive query methods
declare module 'mongoose' {
  interface Model<T extends Document<any, any, any>, TQueryHelpers = {}> {
    findById(id: any, projection?: any, options?: any): AnyQuery<T>;
    findOne(filter?: any, projection?: any, options?: any): AnyQuery<T>;
    find(filter?: any, projection?: any, options?: any): mongoose.Query<T[], T>;
    findOneAndUpdate(filter: any, update: any, options?: any): AnyQuery<T>;
    findOneAndDelete(filter: any, options?: any): AnyQuery<T>;
    updateOne(filter: any, update: any, options?: any): AnyQuery<T>;
    updateMany(filter: any, update: any, options?: any): AnyQuery<any>;
    findByIdAndUpdate(id: any, update: any, options?: any): AnyQuery<T>;
    findByIdAndDelete(id: any, options?: any): AnyQuery<T>;
  }
}
