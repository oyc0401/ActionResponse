# ActionResponse
ActionResponse는 NEXT.js의 Server Action을 더 쓰기 쉽게 해주는 라이브러리입니다.

해당 라이브러리를 사용하면 server action을 REST API를 사용하는 것과 비슷한 경험을 느낄 수 있습니다.

## 서버 액션의 장점
- 타입 체크를 알아서 해준다.

- 내 웹사이트가 아닌 다른 곳에서 api를 호출하기 힘들다.


## 사용방법
서버액션을 만들 때 ActionResponse를 반환하게 합니다.

```typescript
'use server'
import { ActionResponse } from "@/actionResponse";

async function getProfile(username: string) {
  const user = await getUserFromDb(username);
  if (!user) {
    return ActionResponse.notFound();
  }
  return ActionResponse.ok(user);
}
```

클라이언트 코드에서 `action()`을 사용해 해당 서버액션을 사용합니다.

이때 오류가 발생하면 에러를 던지게 됩니다.

```typescript
"use client";
import { action } from "@/actionResponse";

export default function Page() {
  async function get() {
    try {
      const response = await action(getProfile('mike'));
      console.log(response)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div>
      <button onClick={get} />
    </div>
  );
}

```