import { ChatMessage, InvestorMember } from '../types';

export const INITIAL_CHAT_MEMBERS: InvestorMember[] = [
  {
    id: 'usr-agribot',
    name: 'AgriBot AI',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    country: 'BirdGrow Intelligence',
    countryCode: 'EU',
    role: 'bot',
    badge: 'Official AI Advisor',
    onlineStatus: 'online',
    lastSeen: 'Always active',
    bio: 'Automated 24/7 poultry agronomy & financial advisor. Ask me anything about yields, minimum entries, off-platform payments or Portugal progress.',
    isAiBot: true,
  },
  {
    id: 'usr-admin-01',
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    country: 'Netherlands',
    countryCode: 'NL',
    role: 'admin',
    badge: 'Operations Lead',
    onlineStatus: 'online',
    lastSeen: 'Active now',
    bio: 'BirdGrow Chief Operations Officer. Managing telemetry, off-platform balance approvals, and EU distribution contracts.',
  },
  {
    id: 'usr-investor-02',
    name: 'Dr. Markus Weber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    country: 'Germany',
    countryCode: 'DE',
    role: 'investor',
    badge: 'Tier 3 VIP Backer',
    investedAmount: 15000,
    activePlanTitle: 'Starter Plan',
    onlineStatus: 'online',
    lastSeen: '5m ago',
    bio: 'Veterinary agronomist based in Nuremberg. Investing in automated biological poultry cycles since early 2026.',
  },
  {
    id: 'usr-investor-03',
    name: 'Sophie Laurent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    country: 'France',
    countryCode: 'FR',
    role: 'investor',
    badge: 'Tier 2 Backer',
    investedAmount: 8500,
    activePlanTitle: 'Growth Plan',
    onlineStatus: 'online',
    lastSeen: '12m ago',
    bio: 'Organic supply chain director in Lyon. Enthusiastic backer of Normandy and Nouvelle-Aquitaine hubs.',
  },
  {
    id: 'usr-investor-04',
    name: 'Jan de Vries',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    country: 'Netherlands',
    countryCode: 'NL',
    role: 'investor',
    badge: 'Premier Backer',
    investedAmount: 22000,
    activePlanTitle: 'High-Yield Layer Cycle',
    onlineStatus: 'away',
    lastSeen: '35m ago',
    bio: 'Clean-tech founder from Rotterdam. Passionate about 4-tier geothermal & grid-resilient climate-neutral layer houses with summer peak shaving.',
  },
  {
    id: 'usr-investor-05',
    name: 'Mateo Rossi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    country: 'Italy',
    countryCode: 'IT',
    role: 'investor',
    badge: 'Tier 1 Backer',
    investedAmount: 5000,
    activePlanTitle: 'Po Valley Golden Yolk Hub',
    onlineStatus: 'online',
    lastSeen: 'Just now',
    bio: 'Milanese portfolio manager specializing in ESG and certified organic food production assets.',
  },
  {
    id: 'usr-investor-06',
    name: 'Ingrid Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    country: 'Sweden',
    countryCode: 'SE',
    role: 'investor',
    badge: 'Tier 3 Backer',
    investedAmount: 25000,
    activePlanTitle: 'Climate-Neutral Layers',
    onlineStatus: 'offline',
    lastSeen: '2h ago',
    bio: 'Stockholm sustainability consultant backing KRAV-certified organic layer facilities in Skåne.',
  },
];

// Seed group messages within the rolling 24-hour window
export const getSeedGroupMessages = (): ChatMessage[] => {
  const now = Date.now();
  return [
    {
      id: 'grp-msg-1',
      senderId: 'usr-investor-04',
      senderName: 'Jan de Vries',
      senderRole: 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'Netherlands',
      senderBadge: 'Premier Backer',
      senderInvestedAmount: 22000,
      senderPlanTitle: 'High-Yield Layer Cycle',
      content: 'Good morning everyone! Just checked the telemetry for the Utrecht layer hub. Daily egg output is already averaging 96% of peak target capacity. Very solid numbers this week.',
      timestamp: new Date(now - 19 * 3600 * 1000).toISOString(),
      type: 'group',
    },
    {
      id: 'grp-msg-2',
      senderId: 'usr-investor-05',
      senderName: 'Mateo Rossi',
      senderRole: 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'Italy',
      senderBadge: 'Tier 1 Backer',
      senderInvestedAmount: 5000,
      senderPlanTitle: 'Po Valley Golden Yolk Hub',
      content: '@AgriBot Can you share the latest status on the Portugal Arctic Bio-Dome facility? Curious when the live camera feed unlocks!',
      timestamp: new Date(now - 14 * 3600 * 1000).toISOString(),
      type: 'group',
    },
    {
      id: 'grp-msg-3',
      senderId: 'usr-agribot',
      senderName: 'AgriBot AI',
      senderRole: 'bot',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'BirdGrow AI',
      senderBadge: 'Official AI Advisor',
      content: 'Hello Mateo! The Portugal Arctic Sub-Zero Bio-Dome is currently at 65% commissioning progress. Per protocol, the classified facility image remains blurred until construction hits 100%. Target opening capacity: 2,800 cold-hardy layers producing ~25,000 Arctic organic eggs daily!',
      timestamp: new Date(now - 13.8 * 3600 * 1000).toISOString(),
      type: 'group',
      isAiBot: true,
      replyTo: {
        id: 'grp-msg-2',
        senderName: 'Mateo Rossi',
        content: '@AgriBot Can you share the latest status on the Portugal Arctic Bio-Dome facility?...',
      },
    },
    {
      id: 'grp-msg-4',
      senderId: 'usr-investor-03',
      senderName: 'Sophie Laurent',
      senderRole: 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'France',
      senderBadge: 'Tier 2 Backer',
      senderInvestedAmount: 8500,
      senderPlanTitle: 'Growth Plan',
      content: 'Can confirm that off-platform deposits work seamlessly. Sent USDT yesterday, submitted the transaction reference, and the admin team verified it on the backend and credited my main balance in under 20 minutes.',
      timestamp: new Date(now - 8 * 3600 * 1000).toISOString(),
      type: 'group',
    },
    {
      id: 'grp-msg-5',
      senderId: 'usr-investor-02',
      senderName: 'Dr. Markus Weber',
      senderRole: 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'Germany',
      senderBadge: 'Tier 3 VIP Backer',
      senderInvestedAmount: 15000,
      senderPlanTitle: 'Starter Plan',
      content: 'Feed Conversion Ratio on the Bavaria Eco-Hub Alpha came in at 1.49 this morning. As an agronomist, that metabolic efficiency is among the top 2% of European organic operations.',
      timestamp: new Date(now - 4.5 * 3600 * 1000).toISOString(),
      type: 'group',
    },
    {
      id: 'grp-msg-6',
      senderId: 'usr-admin-01',
      senderName: 'Elena Vance',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'Netherlands',
      senderBadge: 'Operations Lead',
      content: 'Notice to all capital partners: Weekly veterinary audits have concluded with 100% negative pathogen screens across our 30+ European facilities. Also, remember that messages in this group lounge automatically roll over every 24 hours to keep updates fresh and focused.',
      timestamp: new Date(now - 2 * 3600 * 1000).toISOString(),
      type: 'group',
    },
    {
      id: 'grp-msg-7',
      senderId: 'usr-investor-05',
      senderName: 'Mateo Rossi',
      senderRole: 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'Italy',
      senderBadge: 'Tier 1 Backer',
      senderInvestedAmount: 5000,
      senderPlanTitle: 'Po Valley Golden Yolk Hub',
      content: 'Has anyone re-invested their earnings balance directly into Tier 3 (150% in 30 days)? Planning to roll over my first payout next week.',
      timestamp: new Date(now - 38 * 60 * 1000).toISOString(),
      type: 'group',
    },
    {
      id: 'grp-msg-8',
      senderId: 'usr-investor-02',
      senderName: 'Dr. Markus Weber',
      senderRole: 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      senderCountry: 'Germany',
      senderBadge: 'Tier 3 VIP Backer',
      senderInvestedAmount: 15000,
      senderPlanTitle: 'Starter Plan',
      content: '@Mateo Rossi Yes, I did that last month. Tier 3 requires €11,500 minimum entry. Once matured, you get your principal plus 150% contractual return directly in your wallet balance.',
      timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
      type: 'group',
      replyTo: {
        id: 'grp-msg-7',
        senderName: 'Mateo Rossi',
        content: 'Has anyone re-invested their earnings balance directly into Tier 3...',
      },
    },
  ];
};

// Seed 1-on-1 direct messages between current investor and members
export const getSeedDirectMessages = (): Record<string, ChatMessage[]> => {
  const now = Date.now();
  return {
    'usr-agribot': [
      {
        id: 'dm-bot-1',
        senderId: 'usr-agribot',
        senderName: 'AgriBot AI',
        senderRole: 'bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        content: 'Welcome to your private session with AgriBot AI! I am here to help you calculate yields, check plan minimums, explain off-platform deposit verification, or give you live telemetry from our 30+ European poultry hubs. What would you like to explore?',
        timestamp: new Date(now - 3 * 3600 * 1000).toISOString(),
        type: 'direct',
        recipientId: 'usr-investor-01',
        isAiBot: true,
      },
    ],
    'usr-investor-02': [
      {
        id: 'dm-markus-1',
        senderId: 'usr-investor-02',
        senderName: 'Dr. Markus Weber',
        senderRole: 'investor',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        senderCountry: 'Germany',
        senderBadge: 'Tier 3 VIP Backer',
        content: 'Hi Curtis! Saw you also allocated to the Bavaria Eco-Hub Alpha. If you have any questions about flock bio-security or European veterinary standards, feel free to ask!',
        timestamp: new Date(now - 5 * 3600 * 1000).toISOString(),
        type: 'direct',
        recipientId: 'usr-investor-01',
      },
    ],
  };
};

// Intelligent Automated Response Generator for AgriBot AI
export const generateAgriBotReply = (prompt: string, userName: string = 'Investor'): string => {
  const p = prompt.toLowerCase();

  if (p.includes('tier') || p.includes('plan') || p.includes('roi') || p.includes('rate') || p.includes('yield')) {
    return `Here are BirdGrow's exact 3 investment tiers, ${userName}:
1. 🌾 Starter Plan: 50% ROI in 15 Days (Min: €500 · Max: €4,499)
2. 🐓 Growth Plan: 84% ROI in 21 Days (Min: €4,500 · Max: €11,499)
3. 🏆 High-Yield Layer Cycle: 150% ROI in 30 Days (Min: €11,500 · Max: €99,999)
4. 👑 Enterprise Plan Cycle: 320% ROI in 60 Days (Min: €100,000 · Max: €1,000,000)

All returns are tied to confirmed European supermarket wholesale off-take contracts and daily egg harvests!`;
  }

  if (p.includes('minimum') || p.includes('min entry') || p.includes('min amount')) {
    return `The minimum entry amounts are strictly enforced across our platform:
• Tier 1 (15 Days · 50%): Minimum entry is €500.
• Tier 2 (21 Days · 84%): Minimum entry is €4,500.
• Tier 3 (30 Days · 150%): Minimum entry is €11,500.
• Tier 4 (60 Days · 320%): Minimum entry is €100,000.

The investment modal will automatically prevent allocations below each tier's minimum requirement!`;
  }

  if (p.includes('payment') || p.includes('off-platform') || p.includes('confirm') || p.includes('deposit') || p.includes('balance') || p.includes('admin')) {
    return `Off-platform payment confirmations work seamlessly:
1. When you deposit via Bitcoin (BTC), Ethereum (ETH), Tether (USDT), or USDC, our system registers your pending request.
2. The Operations Admin verifies the transaction hash or wire receipt on the ledger.
3. Using the Admin Balance Tool, the admin directly credits your 'Main Balance' or 'Earnings Balance' in the database.
4. Your dashboard reflects the confirmed balance instantly!`;
  }

  if (p.includes('portugal') || p.includes('sub-zero') || p.includes('blur') || p.includes('arctic')) {
    return `The Portugal Arctic Sub-Zero Bio-Dome is our new premier high-latitude egg production facility. Currently at 65% commissioning progress, the facility image is dynamically blurred and will automatically reveal completely once construction reaches 100%! Target capacity: 2,800 layers producing 2,500 organic eggs daily.`;
  }

  if (p.includes('24hr') || p.includes('24 hours') || p.includes('retention') || p.includes('expire') || p.includes('history')) {
    return `Per our operational transparency and investor privacy protocol, messages in the Investor Group Chat are strictly retained for 24 hours. Older messages automatically expire so discussions remain focused on real-time flock conditions and daily payouts. 1-on-1 Direct Messages, however, are stored permanently for your convenience!`;
  }

  if (p.includes('facility') || p.includes('facilities') || p.includes('farms') || p.includes('eggs')) {
    return `BirdGrow operates 32 certified production facilities across 10 European nations (over 65% dedicated to cage-free layers and organic eggs, producing over 650,000 eggs daily, plus bio-secure broiler hubs). On the homepage, you can click the dropdown to explore the full 32-facility directory with 4-tier geothermal & energy resilience capacity and breed genetics!`;
  }

  return `Thank you for your message, ${userName}! As BirdGrow's agricultural advisor, I monitor our 32 European hubs and 4 investment tiers (50% in 15d, 84% in 21d, 150% in 30d, and 320% in 60d). Feel free to ask about minimum entries, cycle stages, admin balance credits, or our 24h group chat retention!`;
};

// Realistic response generator when chatting 1-on-1 with other verified investors
export const generateInvestorReply = (member: InvestorMember, prompt: string): string => {
  const p = prompt.toLowerCase();

  if (member.id === 'usr-admin-01') {
    if (p.includes('deposit') || p.includes('balance') || p.includes('payment') || p.includes('crypto')) {
      return "Hello! I am reviewing off-platform deposits right now. If you made a BTC, ETH, or USDT transfer, ensure your transaction reference is submitted in the deposit modal. I update balances directly in the database upon chain confirmation.";
    }
    return "Hi Curtis, thanks for reaching out directly to the operations desk. All 32 production hubs are running smoothly with Tier 1 geothermal base heating and Tier 2 local grid stability, backed by Tier 3 summer peak shaving. Let me know if you need any assistance with account verification or maturity payouts.";
  }

  if (member.id === 'usr-investor-02') { // Dr. Markus Weber
    return `Good to hear from you! From an agronomic standpoint, the biological cycle metrics this quarter have exceeded expectations. Are you planning to roll your returns into the 30-day 150% Tier 3 cycle once this batch finishes?`;
  }

  if (member.id === 'usr-investor-03') { // Sophie Laurent
    return `Salut! I love seeing more verified backers in the community. My 21-day pastured cycle in Normandy is on Day 14 now and looking wonderful. Have you had any payouts credited yet?`;
  }

  if (member.id === 'usr-investor-04') { // Jan de Vries
    return `Hey there! Yes, Utrecht is performing really well. What I value most is that every euro is backed by real physical assets and 4-tier geothermal & grid-backed layer houses rather than paper promises.`;
  }

  return `Thanks for messaging! Always great connecting with fellow BirdGrow investors. Looking forward to comparing notes when our current cycles reach maturity.`;
};