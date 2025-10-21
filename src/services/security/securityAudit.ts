import { supabase } from '@/integrations/supabase/client';

export type SecurityEventType = 
  | 'failed_login'
  | 'successful_login'
  | 'password_reset'
  | 'suspicious_activity'
  | 'data_access'
  | 'profile_update';

interface SecurityEventDetails {
  userAgent?: string;
  ipAddress?: string;
  attemptedEmail?: string;
  resource?: string;
  [key: string]: any;
}

export class SecurityAudit {
  static async logEvent(
    eventType: SecurityEventType,
    details: SecurityEventDetails,
    userId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('security_audit_log')
        .insert({
          user_id: userId || null,
          event_type: eventType,
          event_details: details,
          ip_address: details.ipAddress || null,
          user_agent: details.userAgent || navigator.userAgent
        });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  static async getUserSecurityLog(userId: string) {
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch security log:', error);
      return [];
    }
  }
}