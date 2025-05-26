import { supabase } from "@/lib/supabaseClient";

export async function addNotifications_Log(type, from_user_id, to_user_id,match=false,firstMessage=false) {
try {
  switch (type) {
    case 'like': {
          let insertType = ""
          if(match){ insertType = "match"} 
          else{
            const { data: matchData, error: matchError } = await supabase.from('merry_list')
              .select('id')
              .eq('from_user_id', to_user_id)
              .eq('to_user_id', from_user_id)
              .single();
            if (matchError && matchError.code !== 'PGRST116') {
              throw matchError;
            }
            insertType = matchData ? 'match' : 'like';
          }
            const message = insertType === 'match'
                                          ?`‘${from_user_id}’ Merry you back! Let’s start conversation now`
                                          :`‘${from_user_id}’ Just Merry you! Click here to see profile`;
        
            const { error: insertError } = await supabase.from('notifications').insert({
              from_user_id,
              to_user_id,
              type: insertType,
              created_at: new Date(),
              is_read: true,
              message: message,
            });
            if (insertError) throw insertError;
              break;
    }

    case 'message': {
          let insertType = ""
          if(firstMessage){ insertType = "first time"} 
          else{
            const { data: messagesData, error: messagesError } = await supabase.from('messages')
              .select('id')
              .eq('sender_id', from_user_id)
              .eq('receiver_id', to_user_id)
              .single();
            if (messagesError && messagesError.code !== 'PGRST116') {
              throw matchError;
            }
            insertType = messagesData ? 'first time' : 'Not the first time';
          }
            const message = insertType === 'first time'
                                          ?`‘${from_user_id}’ ---`
                                          :`‘${from_user_id}’ ===`;
      
            const { error: msgError } = await supabase.from('notifications').insert({
              from_user_id,
              to_user_id,
              type: insertType,
              created_at: new Date(),
              is_read: true,
              message: message,
            });
            if (msgError) throw msgError;
              break;
            }

    default:
      throw new Error(`Invalid type: ${type}`);
    }
  
}catch (err) {
    console.error('recordAction error:', err);
    await supabase.from('error_logs').insert({
      function: 'recordAction',
      input: { type, from_user_id, to_user_id },
      error_message: String(err),
      location:"addNotifications_Log"
    });
  }
}
