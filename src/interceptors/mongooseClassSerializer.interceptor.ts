//mongooseClassSerializer.interceptor.ts
import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from "@nestjs/common";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { Document } from "mongoose";

function MongooseClassSerializerInterceptor(
  classToIntercept: Type
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }

    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }
      const plain = document.toJSON();
      plain._id = plain._id.toString(); // Convert _id to string
      return plainToClass(classToIntercept, plain);
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[]
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }
  };
}

export default MongooseClassSerializerInterceptor;
