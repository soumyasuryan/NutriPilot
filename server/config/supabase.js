const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("Supabase URL:", process.env.SUPABASE_URL ? "Defined" : "UNDEFINED");
console.log("Supabase Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Defined" : "UNDEFINED");
// Define a function that we can actually call
const connectDB = async () => {
    try {
        // Just a simple query to see if the connection works
        const { data, error } = await supabase.from('any_table').select('id').limit(1);
        if (error) throw error;
        console.log("Supabase connected successfully.");
    } catch (err) {
        console.error("Supabase connection failed:", err.message);
    }
};

// Export BOTH the client (to use for queries) and the function (to run at startup)
module.exports = { supabase, connectDB };