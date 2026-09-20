import { supabase } from "./supabase.js";

async function testSupabase() {
    const { data, error } = await supabase
        .from("test")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
}

testSupabase();

document.getElementById("deck-button").addEventListener("click", () => {
    const clan = document.querySelector('input[name="clan"]:checked');

    if (!clan) {
        location.href = "deck/index.html";
        return;
    }

    location.href = `deck/index.html?clan=${clan.value}`;
})