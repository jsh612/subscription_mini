// Suspnese 담당 파일
// Suspnese: use <Suspense> to declaratively “wait” for anything else, including data
// 즉, 데이터 받아올 동안 실행될 컴포너는트를 지정 할 수 있다.
// 이것은 useQuery 등 사용시 loading을 사용한 로딩 처리를 대체 할 수 있다.

import React, { Suspense } from "react";
import { View, ActivityIndicator } from "react-native";

export default function withSuspense(Component) {
  return class extends React.Component {
    render() {
      return (
        <Suspense
          fallback={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ActivityIndicator />
            </View>
          }
        >
          <Component />
        </Suspense>
      );
    }
  };
}
