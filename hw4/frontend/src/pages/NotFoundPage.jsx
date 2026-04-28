import { Button, Card, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Card>
      <Result
        status="404"
        title="404"
        subTitle="当前页面不存在，已为你保留返回书籍列表的入口。"
        extra={
          <Link to="/books">
            <Button type="primary">返回书店首页</Button>
          </Link>
        }
      />
    </Card>
  );
}
