import { loadPlayerData, loadTeamData } from "~/lib/data";
import RosterBuilder from "./components/RosterBuilder";

export default function Home() {
  const players = loadPlayerData();
  const teams = loadTeamData();

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-8 text-4xl font-bold">NFL Playoff Fantasy Football</h1>
      <RosterBuilder initialPlayers={players} initialTeams={teams} />
    </main>
  );
}
