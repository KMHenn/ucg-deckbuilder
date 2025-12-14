import { useState } from "react";
import {useAuth} from '../../auth/auth-context';
import {Button} from "@mantine/core";

export default function Logout() {
    const {logout} = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await logout();
            close();
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="filled" onClick={handleSubmit}>
            Log Out
        </Button>
    );
};