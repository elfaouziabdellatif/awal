export const  postLikeEmit = async (postId ,socket) => {
    console.log('you emit an event of like post')
    socket.emit("like-post", postId);
}

export const postUnlikeEmit = async (postId ,socket) => {
    console.log('you emit an event of unlike post')
    socket.emit("unlike-post", postId);
}

export const postLikeListener = async (setPosts, socket,userInfo) => {
    socket.on("like-post", (postId) => {
        console.log('you are listening to like post')

        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post._id === postId) {
                    
                    return {
                        ...post,
                        likes: [...post.likes, userInfo.id],
                    };
                }
                return post;
            })
        );
    });
}

export const postUnlikeListener = async (setPosts, socket ,userInfo) => {
    console.log('you are listening to unlike post')
    socket.on("unlike-post", (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post._id === postId) {
                    return {
                        ...post,
                        likes: post.likes.filter((id) => id !== userInfo.id),
                    };
                }
                return post;
            })
        );
    });
}
