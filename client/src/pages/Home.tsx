import { useAppSelector } from "@/hooks/redux";

const Home = () => {
    const user = useAppSelector(state => state.user);
    if (user.isLoading) {
        return (<h1>Loading...</h1>)
    }
    return (
        <>
            <img src={`${import.meta.env.VITE_BASE_URL}/avatars/${user?.avatar}`} alt="avatar" width={100} />
            <h1>{user?.username}</h1>
        </>
    )
}

export default Home