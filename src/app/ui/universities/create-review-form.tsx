'use client';

import { createReview } from '@/app/lib/actions';
import { StarIcon } from '@heroicons/react/24/solid';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

export default function CreateReviewForm({
  universityId,
  session,
}: {
  universityId: string;
  session: Session;
}) {
  const createReviewWithUniversityId = createReview.bind(
    null,
    parseInt(universityId),
  );
  const initialState = {
    errors: {},
    message: '',
  };
  const [state, formAction] = useFormState(
    createReviewWithUniversityId,
    initialState,
  );

  function Submit() {
    const status = useFormStatus();
    return (
      <button
        type="submit"
        disabled={status.pending}
        className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-500"
      >
        {status.pending ? '送信中...' : '送信'}
      </button>
    );
  }

  const [rating, setRating] = useState(0);

  const onClickHandler = (value: number) => {
    setRating(value);
  };
  const stars = [1, 2, 3, 4, 5];
  return (
    <form action={formAction}>
      <div className="flex justify-center p-20 pb-8">
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
          {/* 授業名フィールド */}
          <div>
            <div className="space-y-2">
              <label htmlFor="className">授業名を入力してください</label>
              <input
                name="className"
                id="className"
                type="text"
                placeholder="授業名を入力"
                aria-describedby="className-error"
                defaultValue=""
                className="w-full rounded border border-gray-200 p-2"
              ></input>
            </div>
            <div id="className-error" aria-live="polite" aria-atomic="true">
              {state.errors?.className &&
                state.errors.className.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* レビュータイトルフィールド */}
          <div>
            <div className="space-y-2">
              <label htmlFor="title">レビュータイトルを入力してください</label>
              <input
                name="title"
                id="title"
                type="text"
                placeholder="タイトルを入力"
                aria-describedby="className-error"
                defaultValue=""
                className="w-full rounded border border-gray-200 p-2"
              ></input>
            </div>
            <div id="className-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors.title.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* 総合評価フィールド */}
          <div>
            <p className="mb-1">総合評価</p>
            <div className="flex ">
              {stars.map((value, element) => (
                <div
                  key={element}
                  onClick={() => onClickHandler(value)}
                  className="hover: cursor-pointer"
                >
                  {element >= rating ? (
                    <StarIcon className="size-12" />
                  ) : (
                    <StarIcon className="size-12 text-yellow-400" />
                  )}
                </div>
              ))}
            </div>
            <input type="hidden" value={rating} name="star" id="star"></input>
            <div id="className-error" aria-live="polite" aria-atomic="true">
              {state.errors?.star &&
                state.errors.star.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* 授業レビューフィールド */}
          <div>
            <div className="space-y-2">
              <label htmlFor="evaluation">授業レビューを入力してください</label>
              <textarea
                name="evaluation"
                id="evaluation"
                placeholder="授業レビューを入力"
                defaultValue=""
                className="block h-[160px] w-full resize-y rounded border border-gray-200 p-2"
              />
            </div>
            <div id="evaluation-error" aria-live="polite" aria-atomic="true">
              {state.errors?.evaluation &&
                state.errors.evaluation.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* 投稿者名フィールド */}
          <div>
            <p>投稿者名を選択してください</p>
            <div className="mt-2 flex gap-4 rounded-md border border-gray-200 bg-white p-4">
              <div className="">
                <input
                  id="anonymous"
                  type="radio"
                  name="who"
                  value="anonymous"
                />
                <label
                  htmlFor="anonymous"
                  className="ml-2 rounded-3xl bg-gray-100 p-2 px-4 text-sm"
                >
                  匿名で投稿
                </label>
              </div>
              <div>
                <input id="username" type="radio" name="who" value="username" />
                <label
                  htmlFor="username"
                  className="ml-2 rounded-3xl bg-green-500 p-2 px-4 text-sm text-white"
                >
                  {session.user!.name}で投稿
                </label>
              </div>
            </div>
            <input
              type="hidden"
              value={session.user!.email!}
              name="email"
              id="email"
            />

            <div id="who-error" aria-live="polite" aria-atomic="true">
              {state.errors?.who &&
                state.errors.who.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            {state.message && (
              <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pb-2 pr-20">
        <Link
          href={`/university/${universityId}`}
          className="
          rounded-xl
          bg-gray-100
          p-3
          hover:bg-gray-200"
        >
          キャンセル
        </Link>
        <Submit />
      </div>
    </form>
  );
}
