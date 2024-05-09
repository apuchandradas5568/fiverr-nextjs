"use client";

import { useMutation } from "convex/react";
import { CreateForm } from "./_components/create-form";
import { api } from "../../../../../../convex/_generated/api";
import { useEffect } from "react";

interface CreateGigProps {
  params: {
    username: string;
  };
}

const CreateGig = ({ params }: CreateGigProps) => {

    const insertCategories = useMutation(api.seedCategories.create)
    
    useEffect(() => {
        insertCategories({})
    }, [])



  return (
    <div className="flex justify-center p-8">
      <CreateForm username={params.username} />
    </div>
  );
};

export default CreateGig;
