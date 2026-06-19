import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project } from "@/types";

export async function loadProjects(uid: string): Promise<Project[]> {
  // orderBy를 쿼리에서 빼면 복합 인덱스가 필요 없다. 정렬은 클라이언트에서 처리.
  const q = query(collection(db, "projects"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Project)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

// Firestore는 undefined 값을 거부하므로 저장 전에 제거한다.
function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function saveProject(uid: string, project: Project): Promise<void> {
  await setDoc(doc(db, "projects", project.id), stripUndefined({ ...project, uid }));
}

export async function deleteProject(projectId: string): Promise<void> {
  await deleteDoc(doc(db, "projects", projectId));
}
