import Head from 'next/head';
import { prisma } from 'lib/prisma';
import { Feedback, FeedbackType } from '.prisma/client';
import Link from 'next/link';
import { useTable } from 'react-table'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'

export default function FeedbackPage({ feedback }) {



  const formatFeedbackType = (feedback: FeedbackType) => {
    switch (feedback) {
      case 'FEEDBACK':
        return 'bg-green-500 text-green-800';
      case 'IDEA':
        return 'bg-yellow-300 text-yellow-800';
      case 'ISSUE':
        return 'bg-red-400 text-red-800';
    }
  };
 
  const queryClient = new QueryClient();
    // Access the client
 
    // Queries
    const query = useQuery('feedback',getServerSideProps)
  
    const columns =[{
      Header: 'Name',
      accessor: 'name', // accessor is the "key" in the data
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Message',
      accessor: 'message',
    },
    {
      Header: 'Feedback type',
      accessor: 'feedbackType',
    },
  ];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, query })
  
  
  return (
    <QueryClientProvider client={queryClient}>
    <div>
      <Head>
        <title>Feedback App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my- my-36 h-auto">
        <div className="container mx-auto max-w-screen-lg px-4">
          <h1 className="text-3xl mb-5 font-bold tracking-wide text-white">
            Feedback
          </h1>
          <section className="flex flex-col  ">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-800 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-800 ">
                    <thead className="bg-gray-800">
                    {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
                 className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
                     
                    </thead>
                    <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                     className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white"
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
                 
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    </QueryClientProvider>
  );
}

export const getServerSideProps = async () => {
  const feedback = await prisma.feedback.findMany({
    select: {
      message: true,
      id: true,
      feedbackType: true,
      name: true,
      email: true,
    },
  });

  console.log(feedback);
  return {
    props: {
      feedback,
    },
  };
};
