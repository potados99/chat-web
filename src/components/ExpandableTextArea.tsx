import styled from 'styled-components';
import React, {useEffect, useRef} from 'react';

export default function ExpandableTextArea({
  children,
  value,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const updateScrollHeight = () => {
    if (ref.current == null) {
      return;
    }

    /**
     * 먼저 높이를 초기화해준 다음 scrollHeight을 적용합니다.
     * 이렇게 하지 않으면 늘어난 높이가 다시 줄어들지 않습니다.
     */
    ref.current.style.height = 'inherit';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  };

  useEffect(() => {
    updateScrollHeight();
  }, [value]);

  return (
    <TextArea {...rest} ref={ref} value={value} rows={1}>
      {children}
    </TextArea>
  );
}

const TextArea = styled.textarea`
  border: none;
  padding: 0;
  resize: none;
  max-height: 80vh;
`;
