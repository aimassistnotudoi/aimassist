export async function getLoginData() {
    let savedUserId = localStorage.getItem("userId");
    let savedUserName = null;
    let isSignedIn = false;

    if (savedUserId) {
        const { data, error } = await supabase.rpc(
            "get_user_name",
            {
                target_user_id: savedUserId
            }
        );

        if (error) {
            console.error(error);
        }

        if (data) {
            savedUserName = data;
            isSignedIn = true;
        } else {
            localStorage.removeItem("userId");
            savedUserId = null;
        }
    }

    return {
        savedUserId,
        savedUserName,
        isSignedIn
    };
}