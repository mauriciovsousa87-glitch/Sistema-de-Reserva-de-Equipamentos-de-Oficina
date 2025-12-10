
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com as credenciais fornecidas
// URL do projeto
const supabaseUrl = 'https://ghgyiscnzcwokillnlox.supabase.co';

// Chave da API (Anon/Public)
const supabaseKey = 'sb_publishable_Rrx2V2shk9Y3meAlyQkBug_eVMBLGDr';

export const supabase = createClient(supabaseUrl, supabaseKey);