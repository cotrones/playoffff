import fs from "fs";
import path from "path";

export interface Player {
  jerseyNum: string;
  espnName: string;
  team: string;
  pos: string;
  exp: string;
  age: string;
  espnHeadshot: string;
  teamID: string;
}

export interface Team {
  teamAbv: string;
  teamName: string;
  conferenceAbv: string;
}

interface RosterData {
  body: {
    team: string;
    teamID: string;
    roster: Player[];
  };
}

interface TeamData {
  body: {
    teamAbv: string;
    teamName: string;
    conferenceAbv: string;
  }[];
}

export function loadPlayerData(): Player[] {
  const teams = [
    "HOU",
    "CIN",
    "KC",
    "MIA",
    "BAL",
    "NYJ",
    "PIT",
    "DET",
    "PHI",
    "SF",
    "ATL",
    "GB",
    "CHI",
    "LAR",
  ];
  const players: Player[] = [];

  teams.forEach((team) => {
    const filePath = path.join(
      process.cwd(),
      "data",
      `tank-${team.toLowerCase()}-roster.json`,
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents) as RosterData;

    data.body.roster.forEach((player: Player) => {
      if (["QB", "RB", "WR", "TE", "PK"].includes(player.pos)) {
        players.push(player);
      }
    });

    // Add team defense as a player
    players.push({
      jerseyNum: "",
      espnName: `${data.body.team} Defense`,
      team: data.body.team,
      pos: "DEF",
      exp: "",
      age: "",
      espnHeadshot: "",
      teamID: data.body.teamID,
    });
  });

  return players;
}

export function loadTeamData(): Team[] {
  const filePath = path.join(process.cwd(), "data", "tank-teams.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents) as TeamData;

  return data.body.map((team) => ({
    teamAbv: team.teamAbv,
    teamName: team.teamName,
    conferenceAbv: team.conferenceAbv,
  }));
}
