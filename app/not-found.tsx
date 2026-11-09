import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <span>404</span>
      <h1>这个页面暂时走丢了。</h1>
      <p>回到组件库，继续寻找你的下一个灵感。</p>
      <Link className="primary-link" href="/components">
        浏览组件 →
      </Link>
    </div>
  );
}
