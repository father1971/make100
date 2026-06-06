/**
 * Telegram Game Score Sender Utility (Frontend)
 * This utility handles packaging and securely sending the game result to your Cloudflare Workers backend.
 */

export interface GameScoreResult {
  solvedCount: number;
  totalSolveTime: number;
  totalOperatorsUsed: number;
}

export interface SendScoreResult {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Sends the final game results to your Cloudflare Workers backend.
 * Automatically retrieves the secure `initData` string from the Telegram WebApp SDK
 * to allow the backend to verify the integrity and origin of the score.
 * 
 * @param backendUrl The full URL of your Cloudflare Worker backend (e.g., 'https://backend.yoursubdomain.workers.dev/api/score')
 * @param result The game outcomes/statistics (e.g. solvedCount, totalSolveTime, totalOperatorsUsed)
 */
export async function sendGameScoreToBackend(
  backendUrl: string,
  result: GameScoreResult
): Promise<SendScoreResult> {
  try {
    // 1. Get Telegram WebApp SDK instance
    const tg = (window as any).Telegram?.WebApp;
    
    if (!tg) {
      console.warn("Telegram WebApp SDK is not available in the current environment.");
      return {
        success: false,
        message: "Telegram WebApp SDK is not available."
      };
    }

    // Ensure the WebView is fully expanded
    if (typeof tg.expand === 'function') {
      tg.expand();
    }

    // 2. Fetch secure initData
    const initData = tg.initData;
    
    if (!initData) {
      console.error("tg.initData is empty. Cannot perform secure backend validation.");
      return {
        success: false,
        message: "initData is empty. Secure validation is not possible."
      };
    }

    // 3. Format the secure payload including the initData and the game results
    const payload = {
      initData,
      solvedCount: result.solvedCount,
      totalSolveTime: result.totalSolveTime,
      totalOperatorsUsed: result.totalOperatorsUsed,
      clientTimestamp: Math.floor(Date.now() / 1000)
    };

    console.log("Sending score result to Cloudflare backend...", {
      solvedCount: result.solvedCount,
      totalSolveTime: result.totalSolveTime,
      totalOperatorsUsed: result.totalOperatorsUsed
    });

    // 4. Submit POST request to the Cloudflare Worker
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = responseData?.error || `Server returned status ${response.status}`;
      console.error("Backend score validation failed:", errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: responseData
      };
    }

    console.log("Score successfully validated and updated in Firebase!:", responseData);
    return {
      success: true,
      message: "Score successfully verified and recorded.",
      data: responseData
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Exception in sendGameScoreToBackend:", error);
    return {
      success: false,
      message: `Failed to connect to score server: ${errorMsg}`
    };
  }
}
