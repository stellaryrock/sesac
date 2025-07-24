import FolderDropdown from '@/components/FolderDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { createPost } from '@/lib/actions/post';

export default async function Board() {
  return (
    <>
      <div>
        <Link href='https://www.loom.com/share/1295e39f7c7444d69cf5bb42f97162bf'>
          출처: [LOOM]
        </Link>
      </div>
      <form action={createPost} className='m-3 space-y-3'>
        <div className='flex'>
          <FolderDropdown />
          <Input name='title' type='text' placeholder='title...' />
        </div>
        <div>
          <Textarea
            name='content'
            className='min-h-32'
            rows={12}
            placeholder='content...'
          ></Textarea>
        </div>

        <div className='flex justify-between'>
          <Button>Cancel</Button>
          <Button variant='destructive'>Remove</Button>
          <Button variant='primary'>Save</Button>
        </div>
      </form>
    </>
  );
}
