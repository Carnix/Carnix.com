let _ctx = { classTitle: 'Adventurer', floorNum: 1, playerName: 'Hero' };
const _used = {};

const LINES = {
  greet: [
    () => `Ah. ${_ctx.playerName}. Back again. I was almost worried you wouldn't return. Almost.`,
    () => `Welcome back to Floor One, ${_ctx.playerName}. I've redecorated. You'll hate it.`,
    () => `Oh good. The ${_ctx.classTitle} lives again. My entertainments continue.`,
    () => `I trust the last death was instructive? No? Somehow I'm not surprised.`,
    () => `The dungeon awaits, little ${_ctx.classTitle}. Do try to last longer than usual.`,
    () => `${_ctx.playerName}. Always ${_ctx.playerName}. You are nothing if not persistent.`,
  ],
  death: [
    () => `And there it is. Goodnight, ${_ctx.classTitle}. Your skills, at least, will survive you.`,
    () => `Floor ${_ctx.floorNum}. That's... actually lower than last time. Impressive, in a sad way.`,
    () => `I've seen better deaths. That was adequate. Merely adequate.`,
    () => `Most ${_ctx.classTitle}s expire around Floor ${_ctx.floorNum}. You're right on schedule.`,
    () => `Well. That was brisk. Shall we go again, or have you had enough humiliation for one session?`,
    () => `You know, most people learn from their mistakes. You are a fascinating exception.`,
  ],
  monsterKill: [
    () => `One less monster in my dungeon. How thoughtful. I'll just make more.`,
    () => `Oh, well done. Have a biscuit. Just kidding — there are no biscuits.`,
    () => `The ${_ctx.classTitle} strikes again. Don't let it go to your head.`,
    () => `Adequate. I've seen more graceful kills from retired librarians, but still. Adequate.`,
    () => `Dead. Fine. Move along.`,
    () => `I shaped that monster with my own hands, you know. It had a name. I've forgotten it, but still.`,
  ],
  findGold: [
    () => `Gold. How delightfully mundane. Spend it wisely — you won't have it long.`,
    () => `Money! Lovely money! It won't save you, but at least you'll die wealthy.`,
    () => `Ah yes, the eternal motivator. Even in mortal peril, the ${_ctx.classTitle} stops for coins.`,
    () => `That gold was there for a reason. I was saving it. No matter.`,
    () => `I once tried to fill the dungeon with only non-monetary treasure. You all ignored it. Gold it is.`,
  ],
  emptyRoom: [
    () => `Nothing here. Just you, the silence, and my unending disappointment.`,
    () => `An empty room. I decorated it with existential dread. Can you feel it?`,
    () => `Nothing. This is a metaphor for your life choices. No, really — it's just empty.`,
    () => `Cleared. Swept. Boring. Like most things involving you.`,
    () => `I could have put something here. I chose not to. Consider it a rest. You look terrible.`,
  ],
  newFloor: [
    () => `Floor ${_ctx.floorNum}. I've upgraded the monsters. You're welcome.`,
    () => `Deeper. Always deeper. There is no bottom, ${_ctx.playerName}. Only me.`,
    () => `Floor ${_ctx.floorNum}. I confess I didn't expect you to make it this far. I've adjusted accordingly.`,
    () => `A new configuration. I worked very hard on this one. Please die somewhere interesting.`,
    () => `The ${_ctx.classTitle} descends. How poetic. How futile.`,
  ],
  skillUp: [
    () => `Oh. You're getting better. How inconvenient for me.`,
    () => `A skill improves. Don't get excited — the monsters improved while you were busy.`,
    () => `Growth. Genuine growth. Nauseating.`,
    () => `You know, in another life you might have been competent. Keep practicing.`,
    () => `Careful. I'm running out of ways to kill you at this rate.`,
  ],
  lowHp: [
    () => `Oh dear. Is that blood? Most of your blood is supposed to be on the inside.`,
    () => `You look terrible. Have you considered a different hobby?`,
    () => `Floor ${_ctx.floorNum} and already half-dead. You are a gift, ${_ctx.playerName}.`,
    () => `Now would be an excellent time to flee. Not that I'm helping you. Just... observing.`,
    () => `I'd say I was worried but I'd be lying.`,
  ],
  hiding: [
    () => `Oh, hiding, are we? How refreshingly cowardly. I'll send someone to find you.`,
    () => `You think shadows hide you from ME? ${_ctx.playerName}, I invented this dungeon.`,
    () => `Adorable. The ${_ctx.classTitle} thinks it can hide. I'm sending a Seeker.`,
  ],
  classChange: [
    () => `Interesting. Your playstyle has... clarified. The dungeon acknowledges: ${_ctx.classTitle}.`,
    () => `Well, well. ${_ctx.classTitle} now, are we? The title suits you. Barely.`,
    () => `The ${_ctx.classTitle} emerges from the wreckage of your choices. How fitting.`,
  ],
  foundScroll: [
    () => `Oh, found a scroll? Good luck reading that. The ink is... special.`,
    () => `More spells. Because what this situation needed was more ways for you to hurt yourself.`,
    () => `A scroll! How wonderful. I assume you'll use it at the least helpful possible moment.`,
  ],
  chestSmash: [
    () => `Subtle. Very subtle. I'm sure nothing heard that.`,
    () => `That's one way to open a chest. Terrible, but creative.`,
    () => `CRASH. Yes, that was quiet. Barely noticeable. I'm sure.`,
    () => `The ${_ctx.classTitle} uses the time-honored technique of hitting things until they work.`,
  ],
  fleeSuccess: [
    () => `Gone! Just like that. Well, running is a skill too, I suppose.`,
    () => `You fled. The monster is confused. I am... mildly impressed.`,
    () => `Retreat! The ancient strategy of not dying. Well executed.`,
  ],
  fleeFail: [
    () => `Nowhere to run, little ${_ctx.classTitle}. You should have trained your legs more.`,
    () => `Cornered. Interesting. Fight your way out, I suppose.`,
    () => `I blocked the exits. Did I mention that? I meant to mention that.`,
  ],
};

export const setContext = (ctx) => Object.assign(_ctx, ctx);

export const getLine = (trigger) => {
  const pool = LINES[trigger];
  if (!pool?.length) return '';

  if (!_used[trigger]) _used[trigger] = new Set();
  if (_used[trigger].size >= pool.length) _used[trigger].clear();

  const available = pool.reduce((acc, _, i) => {
    if (!_used[trigger].has(i)) acc.push(i);
    return acc;
  }, []);

  const idx = available[Math.floor(Math.random() * available.length)];
  _used[trigger].add(idx);
  return pool[idx]();
};
