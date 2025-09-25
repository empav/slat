interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceIdPage({ params }: Props) {
  const ps = await params;
  return <div>Test page {ps.workspaceId}</div>;
}
