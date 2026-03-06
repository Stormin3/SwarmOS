/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Directory } from "./pages/Directory";
import { AgentProfile } from "./pages/AgentProfile";
import { HRExpert } from "./pages/HRExpert";
import { Chat } from "./pages/Chat";
import { Security } from "./pages/Security";
import { Integrations } from "./pages/Integrations";
import { Projects } from "./pages/Projects";
import { Settings } from "./pages/Settings";
import { BrandKit } from "./pages/BrandKit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="directory" element={<Directory />} />
          <Route path="directory/:id" element={<AgentProfile />} />
          <Route path="hr" element={<HRExpert />} />
          <Route path="chat" element={<Chat />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="security" element={<Security />} />
          <Route path="brand-kit" element={<BrandKit />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
