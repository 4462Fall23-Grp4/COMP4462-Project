export function getRankColor(rank) {
  var group = null

  if (!Array.isArray(rank)) {
    group = rank.split(' and ')
  }

  if (group.length == 1) { group = group[0] }
  else { group = group.find(x => x.includes("Professor")) }

  if (group == "Chair Professor") return '#0057e7'
  else if (group == "Professor") return '#d62d20'
  else if (group == "Associate Professor") return '#ffa700'
  else if (group == "Assistant Professor") return '#008744'
}

export const ranks = ["Chair Professor", "Professor", "Associate Professor", "Assistant Professor"]
