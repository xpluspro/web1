import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    onLoginSuccess(form.name || form.email.split('@')[0]);
    navigate('/');
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_35%),linear-gradient(135deg,_#0f172a,_#111827_55%,_#1d4ed8)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <article className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur sm:p-10">
          <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.35em] text-primary-600">
            Welcome Back
          </p>
          <h1 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            登录书香云端
          </h1>
          <p className="mb-8 text-center text-sm text-gray-500">
            本页面保留原作业的登录视觉风格，但已迁移为 React 组件。
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">昵称</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="输入你的昵称"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">电子邮箱</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">密码</span>
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              登录账号
            </button>
          </form>
        </article>
      </div>
    </div>
  );
}
