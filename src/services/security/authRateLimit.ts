import { supabase } from '@/integrations/supabase/client';

interface RateLimitCheck {
  allowed: boolean;
  attemptsRemaining: number;
  blockedUntil?: Date;
}

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 15;
const WINDOW_MINUTES = 5;

export class AuthRateLimit {
  static async checkRateLimit(identifier: string): Promise<RateLimitCheck> {
    try {
      const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
      
      // Get current rate limit record
      const { data: rateLimit } = await supabase
        .from('auth_rate_limits')
        .select('*')
        .eq('user_identifier', identifier)
        .gte('last_attempt', windowStart.toISOString())
        .single();

      if (!rateLimit) {
        return { allowed: true, attemptsRemaining: MAX_ATTEMPTS - 1 };
      }

      // Check if currently blocked
      if (rateLimit.blocked_until && new Date(rateLimit.blocked_until) > new Date()) {
        return {
          allowed: false,
          attemptsRemaining: 0,
          blockedUntil: new Date(rateLimit.blocked_until)
        };
      }

      // Check if exceeded max attempts
      if (rateLimit.attempt_count >= MAX_ATTEMPTS) {
        const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
        
        await supabase
          .from('auth_rate_limits')
          .update({ 
            blocked_until: blockedUntil.toISOString(),
            last_attempt: new Date().toISOString()
          })
          .eq('id', rateLimit.id);

        return {
          allowed: false,
          attemptsRemaining: 0,
          blockedUntil
        };
      }

      return {
        allowed: true,
        attemptsRemaining: MAX_ATTEMPTS - rateLimit.attempt_count - 1
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow the attempt but log the error
      return { allowed: true, attemptsRemaining: MAX_ATTEMPTS };
    }
  }

  static async recordAttempt(identifier: string, successful: boolean): Promise<void> {
    try {
      if (successful) {
        // Clear rate limit on successful auth
        await supabase
          .from('auth_rate_limits')
          .delete()
          .eq('user_identifier', identifier);
        return;
      }

      // Record failed attempt
      const { data: existing } = await supabase
        .from('auth_rate_limits')
        .select('*')
        .eq('user_identifier', identifier)
        .single();

      if (existing) {
        await supabase
          .from('auth_rate_limits')
          .update({
            attempt_count: existing.attempt_count + 1,
            last_attempt: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('auth_rate_limits')
          .insert({
            user_identifier: identifier,
            attempt_count: 1,
            last_attempt: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Failed to record auth attempt:', error);
    }
  }
}