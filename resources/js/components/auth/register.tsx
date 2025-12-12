import { useState } from "react";
import {
    Modal,
    TextInput,
    PasswordInput,
    Button,
    Alert,
    Stack,
} from "@mantine/core";

export default function Register({ opened, onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getCookie = (name) => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Step 1 — Get CSRF cookie
            await fetch("/sanctum/csrf-cookie", {
                method: "GET",
                credentials: "include",
            });

            const xsrf = getCookie("XSRF-TOKEN");

            // Step 2 — Register request
            const response = await fetch("/api/v1/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": xsrf ?? "",
                },
                body: JSON.stringify({
                    username,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            if (!response.ok) {
                const txt = await response.text();
                console.log(txt);
                setError("Registration failed. Check your details.");
                setLoading(false);
                return;
            }

            // Auto-login + reload
            onClose();
            window.location.reload();
        } catch (e) {
            console.error(e);
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Register"
            centered
            radius="lg"
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        label="Username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        radius="md"
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        radius="md"
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Repeat password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        radius="md"
                    />

                    {error && (
                        <Alert color="red" radius="md">
                            {error}
                        </Alert>
                    )}

                    <Button type="submit" radius="md" loading={loading} fullWidth>
                        Create account
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
