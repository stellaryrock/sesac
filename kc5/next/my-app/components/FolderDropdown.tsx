'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { use, useEffect, useReducer, useState } from 'react';
import { Folder, getFolders } from '@/lib/folders';

export default function FolderDropdown() {
  const [folders, setFolders] = useState<Folder[]>();
  const [folder, setFolder] = useState<Folder>();
  const [isOpen, toggleOpen] = useReducer((prev) => !prev, false);

  useEffect(() => {
    (async function () {
      const folders = use(getFolders());
      setFolders(folders);
      setFolder(folders[0]);
    })();
  }, []);

  return (
    <DropdownMenu onOpenChange={toggleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          {folder?.title} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {folders?.map((f) => (
          <DropdownMenuCheckboxItem
            key={f.id}
            checked={folder?.id === f.id}
            onClick={() => setFolder(f)}
          >
            {f.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
