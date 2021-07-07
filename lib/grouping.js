export function createGroupsMeta(pop) {
  let res = {};
  // norm = default team member
  if (pop === undefined || pop === 0 || pop > 124) return false;
  else if (pop < 8)     res = { pop: pop, div: 1, norm: pop, team: pop, grouping: [pop] };
  else if (pop === 8)   res = { pop: pop, div: 1, norm: 4, team: 4, grouping: [4, 4] };
  else if (pop === 9)   res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 4] };
  else if (pop === 13)  res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 4, 4] };
  else if (pop === 14)  res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 5, 4] };
  else if (pop === 19)  res = { pop: pop, div: 1, norm: 5, team: 5, grouping: [5, 5, 5, 4] };

  // else if (pop === 31)  return { pop: pop, div: 2, norm: 6, team: 13, grouping: [6, 6, 6, 6, 7] };
  // else if (pop === 32)  return { pop: pop, div: 2, norm: 6, team: 14, grouping: [6, 6, 6, 7, 7] };

  else {
    const mod = pop % 24;
    const tweak = mod >= 1 && mod <= 4 && (pop < 27 || pop > 28);

    let a = Math.ceil(pop / 6);
    if (tweak) a--;

    const b = (a * 6) - pop;
    let max = 0;

    const array = Array(a).fill(6);
    if (tweak) array.fill(7, a - mod);
    if (b > 0) array.fill(5, (a - b));

    const div = Math.ceil(array.length / 4);
    array.forEach(m => { if (m > max) max = m });

    let team = div * max;
    if (tweak) {
      // let addition = mod > 1 ? 2 : 1;
      // let addition = mod % 2 == 0 ? 2 : mod;
      let addition = mod;
      if (addition > div) addition = div;
      team = div * 6 + addition;
    }

    res = { pop: pop, div: div, norm: max > 6 ? 6 : max, team: team, grouping: array }
  }

  if (pop === 31) res.team = 11;

  return res;
}

export function createGroups(persons, data) {
  let start = 0;
  let array = [];
  const grouping = data.grouping;

  for (let i = 0; i < grouping.length; i++) {
    const idx = i + 1;
    const sfx = idx < 10 ? '0' + idx : idx;
    const groupName = `GROUP ${sfx}`;
    if (i == grouping.length - 1) {
      array.push({
        groupName: groupName,
        persons: persons.slice(start)
      });
    } else {
      array.push({
        groupName: groupName,
        persons: persons.slice(start, start + grouping[i])
      });
    }

    start = start + grouping[i];
  }

  return array;
}

export function createSchedules(groups) {
  let pop = 0;
  const div = Math.ceil(groups.length / 4);

  groups.forEach((g) => pop += g.persons.length)
  const norm = createGroupsMeta(pop).norm;

  const schedules = groups.map(({ groupName, persons }, index) => {
    return {
      groupName: groupName,
      persons: persons.length,
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
      norm: norm,
    }
  })

  const divSlots = [];
  /* Always create 4 slot combinations */
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'wawancara', slot2: 'diskusi', slot3: 'online', slot4: 'online'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'diskusi', slot2: 'wawancara', slot3: 'online', slot4: 'online'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'online', slot2: 'online', slot3: 'wawancara', slot4: 'diskusi'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `TD 0${i + 1}`, asw: `TW 0${i + 1}`, slot1: 'online', slot2: 'online', slot3: 'diskusi', slot4: 'wawancara'});

  for (let i = 0; i < schedules.length; i++) {
    const slot = divSlots[i];
    const asw = slot.asw;
    if (schedules[i].persons < schedules[i].norm) asw  = divSlots[i].asw + ' (-)';
    if (schedules[i].persons > schedules[i].norm) asw  = divSlots[i].asw + ' (+)';
    schedules[i].slot1 = slot.slot1;
    schedules[i].slot2 = slot.slot2;
    schedules[i].slot3 = slot.slot3;
    schedules[i].slot4 = slot.slot4;
    schedules[i].asd = slot.asd;
    schedules[i].asw = asw;
    // schedules[i].norm = pop;
  }

  return schedules;
}