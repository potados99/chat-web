import Config from '../Config';
import {useCallback, useEffect, useRef, useState} from 'react';

export default function useUsername() {
  const [username, setUsername] = useState<string>();

  const getProperUsername = useAtomicUsernameResolver();

  useEffect(() => {
    getProperUsername().then((acquired) => {
      if (acquired != null) {
        setUsername(acquired);
      }
    });
  }, [getProperUsername]);

  return username;
}

function useAtomicUsernameResolver() {
  const lock = useRef(false);

  return useCallback(async () => {
    if (lock.current) {
      return null;
    } else {
      lock.current = true;

      const name = await askForUsername(localStorage.getItem('username'), '이름을 정해주세요 :)');
      localStorage.setItem('username', name);

      lock.current = false;

      return name;
    }
  }, [lock]);
}

async function askForUsername(
  currentlyWeHave: string | null,
  promptMessage: string
): Promise<string> {
  const acquiredUsername = currentlyWeHave || prompt(promptMessage);

  if (acquiredUsername == null) {
    return await askForUsername(null, '서비스를 사용하려면 이름이 필요해요 ㅠㅡㅠ');
  }

  if (await isUsernameTaken(acquiredUsername)) {
    return await askForUsername(
      null,
      `${acquiredUsername}은(는) 이미 사용중인 이름입니다. 다른 이름을 골라주세요!`
    );
  }

  return acquiredUsername;
}

async function isUsernameTaken(username: string) {
  const response = await fetch(Config.urls.usernameValidation, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username}),
  });

  return !response.ok;
}
