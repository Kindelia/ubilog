type Cons<T> = { ctor: "Cons"; head: T; tail: List<T> };
type Nil<T> = { ctor: "Nil" };
type List<T> = Cons<T> | Nil<T>;

type HNode<A> = { ctor: "HNode"; value: [bigint, A]; child: List<Heap<A>> };
type Empty<A> = { ctor: "Empty" };
type Heap<A> = Empty<A> | HNode<A>;

export default Heap;

export function merge<A>(a: Heap<A>, b: Heap<A>): Heap<A> {
  if (a.ctor === "Empty") {
    return b;
  } else if (b.ctor === "Empty") {
    return a;
  } else if (a.value[0] > b.value[0]) {
    return {
      ctor: "HNode",
      value: a.value,
      child: { ctor: "Cons", head: b, tail: a.child },
    };
  } else {
    return {
      ctor: "HNode",
      value: b.value,
      child: { ctor: "Cons", head: a, tail: b.child },
    };
  }
}

function merge_pairs<A>(pairs: List<Heap<A>>): Heap<A> {
  switch (pairs.ctor) {
    case "Nil":
      return { ctor: "Empty" };
    case "Cons":
      switch (pairs.tail.ctor) {
        case "Nil":
          return pairs.head;
        case "Cons":
          return merge(
            merge(pairs.head, pairs.tail.head),
            merge_pairs(pairs.tail.tail)
          );
      }
  }
}

export function insert<A>(value: [bigint, A], heap: Heap<A>): Heap<A> {
  return merge({ ctor: "HNode", value: value, child: { ctor: "Nil" } }, heap);
}

export function head<A>(heap: Heap<A>): [bigint, A] | null {
  switch (heap.ctor) {
    case "HNode":
      return heap.value;
    case "Empty":
      return null;
  }
}

export function tail<A>(heap: Heap<A>): Heap<A> {
  switch (heap.ctor) {
    case "HNode":
      return merge_pairs(heap.child);
    case "Empty":
      return heap;
  }
}

// insert :: Ord a => a -> Heap a -> Heap a
// insert x = merge (Heap x [])

// deleteMin :: Ord a => Heap a -> Heap a
// deleteMin (Heap x hs) = mergePairs hs
