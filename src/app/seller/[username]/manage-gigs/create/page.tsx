"use client";

import { CreateForm } from "./_components/create-form";

interface CreateGigProps {
  params: {
    username: string;
  };
}

const CreateGig = ({ params }: CreateGigProps) => {
  return (
    <div>
      <h1>Create Gig</h1>
      <CreateForm username={params.username} />
    </div>
  );
};

export default CreateGig;
