import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProfileCardL from "../../components/ProfileCardL.jsx";
import { UserContext } from "../../context/UserContext.jsx";

const AllProfile = () => {
    const { active, user: currentUser } = useContext(UserContext);
    const params = useParams();
    const username = params.username;

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/user/${username}?includePosts=true`,
                    {
                        withCredentials: true,
                    }
                );

                if (response.data.success) {
                    setUser(response.data.data.user);
                    setPosts(response.data.data.posts || []);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 animate-pulse">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-24 h-24 rounded-xl bg-gray-200"></div>
                                    <div className="space-y-3 flex-1">
                                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1 animate-pulse">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-64"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ProfileCardL
            currentUser={currentUser}
            user={user}
            posts={posts}
            active={active}
        />
    );
};

export default AllProfile;
