/**
 * ActionResponse Library
 * 
 * `ActionResponse`는 서버 액션을 보다 쉽게 처리할 수 있도록 돕는 방법을 제공합니다.
 * 각 HTTP 상태 코드에 대응하는 메서드를 통해 일관된 방식으로 서버액션을 생성할 수 있습니다.
 *
 * @example
 * ```typescript
 * 'use server'
 * import { ActionResponse } from '@/ActionResponse';
 * 
 * async function getProfile() {
 *   return ActionResponse.ok({ name: 'Foo', birth: '20050703' });
 * }
 * ```
 */
export class ActionResponse {
  /**
   * 성공 응답
   * @params `ActionResponseOk`
   */
  static json<Body>(obj: ActionResponseType<Body>) {
    return obj;
  }

  /**
   * 실패 응답
   * @params `ActionResponseError`
   */
  static error(obj: ActionResponseError) {
    return obj;
  }

  /**
   * OK
   * @status `200`
   */
  static ok<T>(message: T) {
    return ActionResponse.json({ status: 200, message });
  }

  /**
   * Bad Request
   * @status `400`
   */
  static badRequest(error = "Bad Request") {
    return ActionResponse.error({ status: 400, error });
  }

  /**
   * Unauthorized
   * @status `401`
   */
  static unauthorized(error = "Unauthorized") {
    return ActionResponse.error({ status: 401, error });
  }

  /**
   * Forbidden
   * @status `403`
   */
  static forbidden(error = "Forbidden") {
    return ActionResponse.error({ status: 403, error });
  }

  /**
   * Not Found
   * @status `404`
   */
  static notFound(error = "Not Found") {
    return ActionResponse.error({ status: 404, error });
  }

  /**
   * Internal Server Error
   * @status `500`
   */
  static internalServerError(error = "Internal Server Error") {
    return ActionResponse.error({ status: 500, error });
  }
}

/**
 * Wrapper of server action
 * 
 * 성공 시 결과값 제공, 오류 발생시 오류 던짐
 * @param serverActionPromise - API 응답을 반환하는 프로미스 함수
 * @example
 * ```typescript
 * 'use client'
 * import { action } from '@/ActionResponse';
 * import { getProfile } from '@/serverAction/profile';
 * try {
 *   const response = await action(getProfile()); // getProfile은 서버액션 함수
 *   console.log(response) // { name: 'Foo', birth: '20050703' }
 * } catch(error) {
 *   if(error.statue == 404){
 *     alert('없는 유저 입니다.');
 *   } else {
 *     console.error(error.message);
 *   }
 * }  
 * ```
 * @ErrorType
 * ```typescript
 * interface Error { status: number; message: any; }
 * ```
 * 
 */
export async function action<Body>(serverActionPromise: Promise<ActionResponseType<Body>>) {

  async function getResponse() {
    try {
      const res = await serverActionPromise;
      return res;
    } catch (error) {
      // 네트워크, 서버 문제 등으로 오류가 났을 때
      if (error instanceof Error) {
        throw {
          status: 500,
          message: error.message,
        }
      }
      throw {
        status: 500,
        message: `${error}`,
      }
    }
  }

  const response = await getResponse();
  if (response.message != null || response.message != undefined) {
    return response.message;
  } else {
    throw {
      status: response.status,
      message: response.error,
    }
  }

}


interface ActionResponseOk<Body> {
  message: Body;
  status: number;
  error?: undefined;
}

interface ActionResponseError {
  message?: undefined;
  status: number;
  error: any;
}

export type ActionResponseType<Body> = ActionResponseOk<Body> | ActionResponseError;

interface ActionError { status: number; message: any; }