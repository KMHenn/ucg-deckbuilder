import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, errors } = useForm({
        username: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <form onSubmit={submit}>
            <input
                value={data.username}
                onChange={e => setData('username', e.target.value)}
            />
            <input
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}
