import { supabase } from '@/lib/supabase';
import { Character, Live2DModel, VRMModel, CharacterInteraction } from '@/types/character';

export class CharacterService {
  /**
   * アクティブなキャラクター一覧を取得
   */
  static async getActiveCharacters() {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        live2d_model:live2d_models(*),
        vrm_model:vrm_models(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Character[];
  }

  /**
   * キャラクターをIDで取得
   */
  static async getCharacterById(id: string) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        live2d_model:live2d_models(*),
        vrm_model:vrm_models(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Character;
  }

  /**
   * デフォルトキャラクターを取得
   */
  static async getDefaultCharacter() {
    const characters = await this.getActiveCharacters();
    return characters[0] || null;
  }

  /**
   * Live2Dモデルを取得
   */
  static async getLive2DModel(id: string) {
    const { data, error } = await supabase
      .from('live2d_models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Live2DModel;
  }

  /**
   * VRMモデルを取得
   */
  static async getVRMModel(id: string) {
    const { data, error } = await supabase
      .from('vrm_models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as VRMModel;
  }

  /**
   * キャラクターインタラクションを記録
   */
  static async recordInteraction(interaction: Omit<CharacterInteraction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('character_interactions')
      .insert(interaction)
      .select()
      .single();

    if (error) throw error;
    return data as CharacterInteraction;
  }

  /**
   * キャラクターの応答を取得
   */
  static async getCharacterResponse(characterId: string, trigger: string) {
    const character = await this.getCharacterById(characterId);
    
    if (!character.personality?.responses) {
      return null;
    }

    const matchingResponse = character.personality.responses.find(
      response => response.trigger.toLowerCase().includes(trigger.toLowerCase())
    );

    if (!matchingResponse) {
      // デフォルト応答
      return {
        response: "こんにちは！何かお手伝いできることはありますか？",
        emotion: "neutral",
        motion: "idle"
      };
    }

    // ランダムに応答を選択
    const randomResponse = matchingResponse.responses[
      Math.floor(Math.random() * matchingResponse.responses.length)
    ];

    return {
      response: randomResponse,
      emotion: matchingResponse.emotion || "neutral",
      motion: matchingResponse.motion || "idle"
    };
  }

  /**
   * キャラクターの統計情報を取得
   */
  static async getCharacterStats(characterId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('character_interactions')
      .select('interaction_type, created_at')
      .eq('character_id', characterId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const stats = {
      total_interactions: data.length,
      clicks: data.filter(i => i.interaction_type === 'click').length,
      hovers: data.filter(i => i.interaction_type === 'hover').length,
      messages: data.filter(i => i.interaction_type === 'message').length,
      gestures: data.filter(i => i.interaction_type === 'gesture').length,
    };

    return stats;
  }

  /**
   * ユーザーの好みのキャラクターを設定
   */
  static async setUserPreferredCharacter(userId: string, characterId: string) {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        preferred_character_id: characterId,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  /**
   * ユーザーの好みのキャラクターを取得
   */
  static async getUserPreferredCharacter(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferred_character_id')
      .eq('user_id', userId)
      .single();

    if (error || !data?.preferred_character_id) {
      return this.getDefaultCharacter();
    }

    return this.getCharacterById(data.preferred_character_id);
  }
}
