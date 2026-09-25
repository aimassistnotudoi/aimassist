import { supabase } from "./supabase.js";
import { getLoginData} from "./login.js";

let {savedUserId, savedUserName, isSignedIn} = await getLoginData();

document.getElementById("deck-button").addEventListener("click", async () => {
    if(!isSignedIn){
        const userName = document.getElementById("sign-in").value.trim();
        const signUp = document.getElementById("sign-up").checked;

        let userId;

        if(signUp){
            if(!userName) {
                alert("Please enter a username to sign up.");
                return;
            }

            const {data, error} = await supabase.rpc(
                "create_user",
                {
                    target_user_name: userName
                }
            );

            if(error){
                console.error(error);
                // すでに存在するユーザー名
                alert("Failed to create user. Please try again.");
                return;
            }

            if(!data){
                alert("Already exists user name. Please choose another one.");
                return;
            }

            userId = data;
        }
        else{
            if(userName){
                const {data, error} = await supabase.rpc(
                    "get_user_id",
                    {
                        target_user_name: userName
                    }
                );

                if(error){
                    console.error(error);
                    //通信エラー
                    alert("Error occurred while fetching user ID. Please try again.");
                    return;
                }

                if(!data){
                    alert("User name not found. Please sign up first.");
                    return;
                }

                userId = data;
            }
        }

        if(userId){
            localStorage.setItem("userId", userId);
            savedUserId = userId;
            isSignedIn = true;
            savedUserName = userName;
        }
    }


    const clan = document.querySelector('input[name="clan"]:checked');

    if (!clan) {
        location.href = "deck/index.html";
        return;
    }

    location.href = `deck/index.html?clan=${clan.value}`;
})