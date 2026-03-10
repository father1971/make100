import fs from 'fs';
import path from 'path';

// This is a simple example of how your Telegram bot can fetch the leaderboard
// You can run this file using: npx tsx bot-example.ts

async function fetchLeaderboard() {
  // In your real bot, replace this URL with your actual app URL
  // e.g., https://your-app-url.run.app/api/leaderboard
  const API_URL = 'http://localhost:3000/api/leaderboard';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const leaderboard = await response.json();
    
    if (leaderboard.length === 0) {
      return "🏆 Рейтинг пока пуст. Станьте первым!";
    }

    let message = "🏆 <b>Топ игроков Make100:</b>\n\n";
    
    leaderboard.slice(0, 10).forEach((user: any, index: number) => {
      let medal = "🏅";
      if (index === 0) medal = "🥇";
      if (index === 1) medal = "🥈";
      if (index === 2) medal = "🥉";
      
      message += `${medal} <b>${user.name}</b> — ${user.score} очков\n`;
    });

    return message;
  } catch (error) {
    console.error("Ошибка при получении рейтинга:", error);
    return "❌ Не удалось загрузить рейтинг. Попробуйте позже.";
  }
}

// Example usage:
fetchLeaderboard().then(msg => console.log(msg));
