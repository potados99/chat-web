import {Notice} from '../types/messaging';
import styled from 'styled-components';

type Props = {
  notice: Notice;
};

export default function NoticeItem({notice}: Props) {
  return <Container>{notice.body}</Container>;
}

const Container = styled.div`
  font-size: 14px;
  text-align: center;
  color: darkgray;
  margin: 12px;
`;
