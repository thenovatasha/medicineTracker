export type User = {
    username: string,
    password: string,
    dateJoined: number,
    refreshToken: string | null;
}