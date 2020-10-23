#include <emscripten.h>
#include <emscripten/bind.h>

void decoder(uintptr_t input, int size)
{
    uint8_t *arr = reinterpret_cast<uint8_t *>(input);
    for (int i = 0; i < size; i++)
    {
        if (i % 3 == 0)
        {
            for (int j = i; j < i + 15 && j < size; j++)
            {
                arr[j] = 100;
            }
        }
        else
        {
            arr[i] += i;
        }
    }
}

EMSCRIPTEN_BINDINGS(test)
{
    emscripten::function("decoder", &decoder, emscripten::allow_raw_pointers());
}