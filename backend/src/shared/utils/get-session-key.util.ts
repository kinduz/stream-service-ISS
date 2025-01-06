export const getSessionKey = (id: string) => {
    const SESSION_FOLDER = process.env.SESSION_FOLDER;

    return `${SESSION_FOLDER}${id}`
}