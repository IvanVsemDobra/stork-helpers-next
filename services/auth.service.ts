
export const AuthService = {
    logout: async () => {
        // Imitate server request
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
}
