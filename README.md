# ActionResponse
ActionResponse는 NEXT.js의 Server Action을 더 쓰기 쉽게 해주는 라이브러리입니다.

해당 라이브러리를 사용하면 Server Action을 REST API를 사용하는 것과 비슷한 경험을 느낄 수 있습니다.

## 서버 액션의 장점
- 타입 생성을 스스로 해준다.

- 내 도메인이 아닌 다른 곳에서 api를 호출하기 힘들다.


## 사용방법
서버액션을 만들 때 ActionResponse를 반환하게 합니다.

`ActionResponse.ok()`의 매개변수에 반환하고 싶은 값을 넣습니다.

```typescript
'use server';
import { ActionResponse } from "@/actionResponse";

export async function getProfile() {
  const user = { name: "Mike", birth: "20030506" };
  return ActionResponse.ok(user);
}
```

클라이언트 코드에서 `action()`을 사용해 해당 서버액션을 사용합니다.

```typescript
'use client';
import { action } from "@/actionResponse";
import { getProfile } from "./serverAction";

export default function Page() {
  async function click() {
    const response = await action(getProfile());
    console.log(response);
  }

  return (
    <div>
      <button onClick={click} />
    </div>
  );
}

```

이때 response의 타입은 하나로 정해져 문법 오류를 막을 수 있습니다.
```typescript
const response: {
    name: string;
    birth: string;
}
```
## 다양한 상태코드

`ActionResponse.unauthorized()`등을 사용해 상태코드가 포함된 에러를 반환할 수 있습니다.

```typescript
'use server';
import { ActionResponse } from "@/actionResponse";

export async function getProfile(userId) {
  const session = await getSession();
  if(!session){
    return ActionResponse.unauthorized(); // status: 401
  }

  if(session.userId != userId){
    return ActionResponse.forbidden(); // status: 403
  }
  
  const user = getUserFromDB(userId)
  if (!user) {
    return ActionResponse.notFound('해당 유저가 없습니다.'); // status: 404
  }
  
  return ActionResponse.ok(user); // status: 200
}
```
### 에러 처리 방법
`action()`에서 예외상황이 발생되면 에러를 던집니다.

try catch문을 사용해 상태코드를 통한 에러처리를 할 수 잇습니다.

```typescript
'use client';
import { action } from "@/actionResponse";
import { getProfile } from "./serverAction";

const userId = 2;
 
export default function Page() {
  async function click() {
    try {
      const response = await action(getProfile(userId));
      console.log(response);
    } catch (error) {
      if(error.status == 401){
        window.location.replace('/login');
      }else if(error.status == 403){
        alert('접근할 수 없습니다.');
      }else if(error.status == 404){
        alert(error.message);
      }else{
        console.error(error.status, error.message)
      }
    }
  }

  return (
    <div>
      <button click={click} />
    </div>
  );
}

```