import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project } from "@/types";

export async function loadProjects(uid: string): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("uid", "==", uid),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Project);
}

export async function saveProject(uid: string, project: Project): Promise<void> {
  await setDoc(doc(db, "projects", project.id), { ...project, uid });
}

export async function deleteProject(projectId: string): Promise<void> {
  await deleteDoc(doc(db, "projects", projectId));
}
