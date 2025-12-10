
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com as credenciais fornecidas
// URL do projeto
const supabaseUrl = 'https://ghgyiscnzcwokillnlox.supabase.co';

// Chave da API (Anon/Public) - JWT Token
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ3lpc2NuemN3b2tpbGxubG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzgyMjYsImV4cCI6MjA4MDk1NDIyNn0.1qzhIJ7A0pfxl8cuHTqFnCAZ7cMIICfhuYKlfhkhchU';

export const supabase = createClient(supabaseUrl, supabaseKey);